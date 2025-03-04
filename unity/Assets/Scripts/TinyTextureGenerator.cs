using System.Collections.Generic;
using UnityEditor;
using UnityEditor.AssetImporters;
using UnityEngine;
using Random = UnityEngine.Random;

[ScriptedImporter(1, "tinytexture")]
public class TinyTextureGenerator : ScriptedImporter
{
	[Range(2, 16)] public int width = 4;
	[Range(2, 16)] public int height = 4;
	public List<Color> colors;

	public override void OnImportAsset(AssetImportContext ctx)
	{
		var count = this.width * this.height;
		this.colors ??= new List<Color>();
		if (this.colors == null || this.colors.Count != count)
		{
			GenerateNewColors();
		}

		var texture = new Texture2D(this.width, this.height);
		texture.filterMode = FilterMode.Point;
		texture.SetPixels(this.colors.ToArray());
		ctx.AddObjectToAsset("main", texture);
		ctx.SetMainObject(texture);
	}

	
	
	
	private void GenerateNewColors()
	{
		var count = this.width * this.height;
		var existing = this.colors;
		this.colors = new List<Color>(count);
		var h = Random.value;
		for (var i = 0; i < count; i++)
		{
			if (existing != null && i < existing.Count)
				this.colors.Add(existing[i]);
			else
			{
				var hsv = Color.HSVToRGB(h, Random.Range(0.8f, 1f), Random.Range(.8f, 1f));
				this.colors.Add(hsv);
				h += 1f / count;
				h %= 1f;
			}
		}
	}

	
	
	
	
	
	
	[CustomEditor(typeof(TinyTextureGenerator))]
	private class TinyTextureEditor : ScriptedImporterEditor
	{
		public override void OnInspectorGUI()
		{
			var generator = (TinyTextureGenerator)target;
			
			var arr = this.serializedObject.FindProperty(nameof(colors));
			
			if (GUILayout.Button("New Colors"))
			{
				generator.colors.Clear();
				generator.GenerateNewColors();
				arr.arraySize = generator.colors.Count;
				for (var i = 0; i < generator.colors.Count; i++)
				{
					arr.GetArrayElementAtIndex(i).colorValue = generator.colors[i];
				}
				this.SaveChanges();
				return;
			}

			GUILayout.Space(5);


			using (var change = new EditorGUI.ChangeCheckScope())
			{
				var availableWidth = (EditorGUIUtility.currentViewWidth - 24) / generator.width;
				var rect = EditorGUILayout.GetControlRect();

				for (var y = 0; y < generator.height; y++)
				{
					rect.x = 18;
					if (y > 0) rect.y += rect.height;
					for (var x = 0; x < generator.width; x++)
					{
						var index = x + y * generator.width;
						if (index >= arr.arraySize) break;
						
						rect.width = availableWidth;
						rect.height = 18;
						arr.GetArrayElementAtIndex(index).colorValue = EditorGUI.ColorField(rect, generator.colors[index]);
						// generator.colors[index] = EditorGUI.ColorField(rect, generator.colors[index]);
						rect.x += rect.width;
					}
				}
				GUILayout.Space(rect.y + rect.height);
				if (change.changed)
				{
					this.SaveChanges();
				}
			}

			base.OnInspectorGUI();
		}
	}
}